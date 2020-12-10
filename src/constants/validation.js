function validate(input) {
    const len = input.length;
    if (input == null || len <= 0) return this.empty.message;
    if (len < this.min.length) return this.min.message;
    if (len > this.max.length) return this.max.message;

    return '';
}

function validateName(input) {
    const len = input.length;
    if (input == null || len <= 0) return this.empty.message;
    if (len < this.min.length) return this.min.message;
    if (len > this.max.length) return this.max.message;

    const names = input.split(' ');

    if (!names) return this.fullName.message;
    if (names.length !== 2) return this.invalid.message;

    return '';
}

function validateEmail(input) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const len = input.length;
    if (input == null || len <= 0) return this.empty.message;
    if (!regex.test(input)) return this.invalid.message;

    return '';
}
export const collectionValidation = {
    title: {
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
        validate,
    },
};

export const tagValidation = {
    value: {
        empty: {
            message: 'Value cannot be empty',
        },
        min: {
            length: 2,
            message: 'Minimum of 2 characters are required',
        },
        max: {
            length: 25,
            message: 'No more than 25 characters are allowed',
        },
        validate,
    },
};

export const authValidation = {
    fullName: {
        empty: {
            message: 'Name cannot be empty',
        },
        min: {
            length: 2,
            message: 'Minimum of 6 characters are required for the name',
        },
        max: {
            length: 25,
            message: 'No more than 40 characters are allowed for the name',
        },
        fullName: {
            message: 'Please enter your full name',
        },
        invalid: {
            message: 'Only two words are allowed for the name',
        },
        validate: validateName,
    },
    email: {
        empty: {
            message: 'Email cannot be empty',
        },
        invalid: {
            message: 'Invalid email',
        },
        validate: validateEmail,
    },
    password: {
        empty: {
            message: 'Password cannot be empty',
        },
        min: {
            length: 6,
            message: 'Minimum of 6 characters are required for the password',
        },
        max: {
            length: 25,
            message: 'No more than 40 characters are allowed for the password',
        },
        validate,
    },
};
