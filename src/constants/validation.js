export const titleValidation = {
    empty: {
        message: 'Title cannot be empty',
    },
    min: {
        length: 3,
        message: 'Minimum of 3 characters are required',
    },
    max: {
        length: 155,
        message: 'No more than 155 characters are allowed',
    },
    validate: function (input) {
        const len = input.length;
        if (input == null || len <= 0) return this.empty.message;
        if (len < this.min.length) return this.min.message;
        if (len > this.max.length) return this.max.message;

        return '';
    },
};
