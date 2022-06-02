const MTProto = require('@mtproto/core/envs/node');
const prompts = require('prompts');
const tempStorage = require('@mtproto/core/src/storage/temp');
const fs = require('fs');

const api_id = '13548374'; // insert api_id here
const api_hash = '577bff7a17ad311d4d48145d65d620d4'; // insert api_hash here

const mtproto = new MTProto({
    //test: true,
    api_id,
    api_hash,
    storageOptions: {
        instance: tempStorage,
    },
});

async function getPhone() {
    return (await prompts({
        type: 'text',
        name: 'phone',
        message: 'Enter your phone number:'
    })).phone
}

async function getCode() {
    // you can implement your code fetching strategy here
    return (await prompts({
        type: 'text',
        name: 'code',
        message: 'Enter the code sent:',
    })).code
}

async function getPassword() {
    return (await prompts({
        type: 'text',
        name: 'password',
        message: 'Enter Password:',
    })).password
}

function startListener() {
    console.log('[+] starting listener')
    mtproto.updates.on('updates', ({ updates }) => {

        //updateEditChannelMessage - изминение

       const newChannelMessages = updates.filter((update) => {
           if (update._ !== 'updateNewChannelMessage') return false

           const { message = {}} = update

           if (message?.peer_id?.channel_id === "1521683754") return true

           return false

       }).map(({ message }) => message)

        // printing new channel messages
        fs.appendFile('input.json', JSON.stringify(newChannelMessages), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });
}

mtproto.call('help.getNearestDc').then(result => {
    console.log('country:', result.country);
});

mtproto
    .call('users.getFullUser', {
        id: {
            _: 'inputUserSelf',
        },
    })
    .then(startListener) // means the user is logged in -> so start the listener
    .catch(async error => {

        // The user is not logged in
        console.log('[+] You must log in')
        const phone_number = await getPhone()

        mtproto.call('auth.sendCode', {
            phone_number: phone_number,
            settings: {
                _: 'codeSettings',
            },
        })
            .catch(error => {
                if (error.error_message.includes('_MIGRATE_')) {
                    const [type, nextDcId] = error.error_message.split('_MIGRATE_');

                    mtproto.setDefaultDc(+nextDcId);

                    return sendCode(phone_number);
                }
            })
            .then(async result => {
                return mtproto.call('auth.signIn', {
                    phone_code: await getCode(),
                    phone_number: phone_number,
                    phone_code_hash: result.phone_code_hash,
                });
            })
            .catch(error => {
                if (error.error_message === 'SESSION_PASSWORD_NEEDED') {
                    return mtproto.call('account.getPassword').then(async result => {
                        const { srp_id, current_algo, srp_B } = result;
                        const { salt1, salt2, g, p } = current_algo;

                       /* const { A, M1 } = await getSRPParams({
                            g,
                            p,
                            salt1,
                            salt2,
                            gB: srp_B,
                            password: await getPassword(),
                        });

                        return mtproto.call('auth.checkPassword', {
                            password: {
                                _: 'inputCheckPasswordSRP',
                                srp_id,
                                A,
                                M1,
                            },
                        });*/
                    });
                }
            })
            .then(result => {
                console.log('[+] successfully authenticated');
                // start listener since the user has logged in now
                startListener()
            });
    })

