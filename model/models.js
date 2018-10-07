const mongoose = require("mongoose");

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    counter: Number
});

const CounterModel = mongoose.model('Counter',counterSchema);

const urlSchema = mongoose.Schema({
    _id: {type: Number},
    url: String,
    created_at: {type: Date, default: Date.now}
});

urlSchema.pre('save', function(next){
    var doc = this;
    CounterModel.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { count: 1 } }, function(err, counter) {
        if(err) return next(err);
        doc._id = counter.counter;
        doc.created_at = new Date();
        next();
    });
}, );

const URLModel = mongoose.model('URL',urlSchema);
module.exports = {URLModel, CounterModel}