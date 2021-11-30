const yup = require('yup');
const registerUserValidation = async (values) => {

    let schema = yup.object().shape({
        userId: yup.string().test('len', 'Must be exactly 11 characters', val => val.length === 11).required(),
        password: yup.string().min(5).required(),
        countryId: yup.string().test('len', 'Must be exactly 2 characters', val => val.length === 2).required(),
        nickName: yup.string().min(1).required(),
    });

    return await schema.isValid(values);
    // schema.validate(values).catch(err => {console.log('---------', err.name, err.errors,'------');return err;}).then(res => {console.log(res);return res;})
}

const saveContactValidation = async (values) => {

    let schema = yup.object().shape({
        // firstName: yup.string().required(),
        // lastName: yup.string().required(),
        identigier: yup.string().test('len', 'Must be exactly 11 characters', val => val.length === 11).required(),
        // jobTitle: yup.string().required(),
        // birthday: yup.string().required(),
        // nickName: yup.string().required(),
        // address: yup.string().required(),
    });

    return await schema.isValid(values);
}

const saveEmailValidation = async (values) => {

    let schema = yup.object().shape({
        subject: yup.string().required(),
    });

    return await schema.isValid(values);
}

const saveGroupValidation = async (values) => {

    let schema = yup.object().shape({
        groupName: yup.string().required(),
        groupContactList: yup.array().of(
            yup.object().shape({
                item: yup.object().shape({
                    contactId: yup.string().test('len', 'Must be exactly 11 characters', val => val.length === 11).required(),
                })
            })
        )
    });

    return await schema.isValid(values);
}

const savePlannerValidation = async (values) => {

    let schema = yup.object().shape({
        title: 
            yup.string().required('Please enter correct value'),
        startDate: 
            yup.date().required('Please enter correct value'),
    });
    

    return await schema.isValid(values);
}

module.exports = {
	registerUserValidation,
    saveContactValidation,
    saveGroupValidation,
    savePlannerValidation,
    saveEmailValidation,
}