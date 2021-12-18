import mongoose from 'mongoose';

export interface Prefix {
    prefix: string;
    jid: string;
}

const PrefixSchema = new mongoose.Schema<Prefix>({
    prefix: {
        type: String,
        required: true,
    },
    jid: {
        type: String,
        required: true,
        unique: true,
    },
});

const PrefixModel = mongoose.model('Prefix', PrefixSchema);

export default PrefixModel;
