/**
 * WebSocket configuration
 */

import path from 'path';
import Primus from 'primus';
import primusEmit from 'primus-emit';

const registerFunctions = [
    // Insert sockets below
    require('../api/gallery/gallery.socket').register,
    require('../api/file/file.socket').register,
    require('../api/project/project.socket').register,
    require('../api/post/post.socket').register,
    require('../api/photo/photo.socket').register,
    require('../api/thing/thing.socket').register,
];

// When the user disconnects.. perform this
function onDisconnect(spark) {
    console.info(`WebSocket from ${spark.address.ip}:${spark.address.port} disconnected`);
}

// When the user connects.. perform this
function onConnect(spark) {
    console.info(`WebSocket from ${spark.address.ip}:${spark.address.port} connected`);

    // When the client emits 'info', this listens and executes
    spark.on('info', data => {
        console.log('info', JSON.stringify(data));
    });

    spark.on('data', data => {
        console.info('data', data);
    });

    // Register the spark with each WebSocket event handler
    for(let register of registerFunctions) {
        register(spark);
    }
}

let primus;

export function broadcast(message) {
    primus.forEach(spark => {
        spark.emit('broadcast', message);
    });
}

/**
 * @param server
 * @return {Promise}
 */
export function initWebSocketServer(server) {
    primus = new Primus(server, {});
    primus.plugin('emit', primusEmit);

    primus.on('connection', onConnect);
    primus.on('disconnection', onDisconnect);
    primus.on('open', () => console.log('open'));
    primus.on('initialised', () => console.log('initialised'));
    primus.on('error', error => console.log(error));

    if(process.env.NODE_ENV === 'development') {
        return new Promise((resolve, reject) => {
            // Save the primus client library configured for our server settings
            primus.save(path.join(__dirname, '../../client/assets/js/primus.js'), err => {
                if(err) return reject(err);

                resolve();
            });
        });
    } else {
        return Promise.resolve();
    }
}
