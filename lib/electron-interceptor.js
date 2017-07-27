/**
 * Created by Pablo on 27 Jul 17.
 */

const {app, protocol} = require('electron');
const fs = require('fs');
const path = require('path');
const mime = require('mime');


const get_path = url => {
    const parsed = require('url').parse(url);
    const result = decodeURIComponent(parsed.pathname);

    return (process.platform === 'win32' && !parsed.host.trim()) ? result.substr(1) : result;
};

const intercept_cb = error => {
    if(error){
        console.error(`Electron interceptor failed...`, error);
        return;
    }
    console.log(`Electron interceptor registered successfully.`);
};

module.exports = (options = []) => {

    app.on('ready', () => {

        protocol.interceptBufferProtocol('file', (request, callback) => {
            const file = get_path(request.url);

            try{
                const file_content = fs.readFileSync(file);
                const file_extension = path.extname(file);

                let current_option = undefined;

                options.forEach(option => {
                    if(option.extension === file_extension)
                        current_option = option;
                });

                if(current_option !== undefined){
                    current_option.exec(file_content, (content) => {
                        return callback({ data: new Buffer(content), mimeType: current_option.mimeType });
                    });
                } else {
                    return callback({ data: file_content, mimeType: mime.lookup(file_extension) });
                }

            } catch (e){
                return callback(e);
            }

        }, intercept_cb);

    });

};