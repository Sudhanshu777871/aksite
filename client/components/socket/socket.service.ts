import { Injectable } from '@angular/core';
import Primus from 'primus';
import primusEmit from 'primus-emit';
import { noop, find, remove } from 'lodash';

@Injectable()
export class SocketService {
    private primus: Primus;
    private open = false;
    private queue: any[] = [];

    constructor() {
        // this.socket = io('', {
        //     // Send auth token on connection, you will need to DI the Auth service above
        //     // 'query': 'token=' + Auth.getToken()
        // });
        const primus = Primus.connect('http://localhost:9050');
        primus.plugin('emit', primusEmit);

        primus.on('open', () => {
            console.log('Connection opened');
            primus.emit('info');

            this.open = true;
            while(this.queue.length) {
                this.emit(this.queue.pop());
            }
        });

        if(process.env.NODE_ENV === 'development') {
            primus.on('data', function message(data) {
                console.log('Socket:', data);
            });
        }

        primus.on('info', data => {
            console.log('info:', data);
        });

        this.primus = primus;
    }

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates(modelName, array, cb = noop) {
        /**
         * Syncs item creation/updates on 'model:save'
         */
        this.primus.on(`${modelName}:save`, item => {
            var oldItem = find(array, {_id: item._id});
            var index = array.indexOf(oldItem);
            var event = 'created';

            // replace oldItem if it exists
            // otherwise just add item to the collection
            if(oldItem) {
                array.splice(index, 1, item);
                event = 'updated';
            } else {
                array.push(item);
            }

            cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        this.primus.on(`${modelName}:remove`, item => {
            remove(array, {_id: item._id});
            cb('deleted', item, array);
        });
    }

    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates(modelName) {
        this.primus.removeAllListeners(`${modelName}:save`);
        this.primus.removeAllListeners(`${modelName}:remove`);
    }

    emit(data: any[]) {
        if(this.open) {
            this.primus.emit.apply(this.primus, data);
        } else {
            this.queue.push(data);
        }
    }
}
