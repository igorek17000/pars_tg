const MTProto = require('@mtproto/core/envs/node');
const prompts = require('prompts');
const tempStorage = require('@mtproto/core/src/storage/temp');
const fs = require('fs');
const { funcAllCreate } = require("./utils");

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

async function getPhone () {
    const { tel } = await JSON.parse(fs.readFileSync('auth.json', 'utf8'));

    return tel
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCode() {
    // you can implement your code fetching strategy here
    const { code = null } = await JSON.parse(fs.readFileSync('auth.json', 'utf8'));

    console.log('code', code)
    if (!code) {
        await timeout(3000);
        return await getCode()
    } else {
        return code
    }
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

        const newChannelMessages = updates.filter((update) => {
            if (update._ !== 'updateNewChannelMessage') return false

            const { message = {}} = update

            if (message?.peer_id?.channel_id === "1521683754") return true


            return false

        }).map(({ message }) => message)

        if(newChannelMessages.length === 0) return

        funcAllCreate(newChannelMessages)

        // printing new channel messages
        fs.appendFile( 'input.json', JSON.stringify(newChannelMessages), function (err) {
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
   // .then(startListener) // means the user is logged in -> so start the listener
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
                const code = await getCode()
                return mtproto.call('auth.signIn', {
                    phone_code: code,
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

