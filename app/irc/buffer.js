

export default class Buffer {
    constructor() { 
        this.data = {}
    }

    add(bufferType, message) {
        let buf = this.data[bufferType] || [];
        if (buf.length > 100) buf.shift();
        buf.push(message);
        this.data[bufferType] = buf;
    }

    get(bufferType) {
        return this.data[bufferType] || [];
    }
};