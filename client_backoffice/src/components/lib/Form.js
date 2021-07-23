import React, {useState} from 'react';

// Example model :
// optionnels : default, minLength, maxLength
// {
//    email: { type: 'email', label: 'Votre adresse mail', default: 'toto@toto.com' /*optional*/ },
//    password: { type: 'password', label: 'Votre mot de passe', minLength: 2},
//    gender: { type: 'select', label: 'Votre sexe',
//                  options: {
//                      man: 'homme',
//                      woman: 'femme',
//                      yolo: 'yolo',
//                      r2d2: 'r2d2'
//                     }
//            }
// }

export default function Form({model, submitLabel , onSubmit, dataValues}) {
    const [ values, setValues ] = useState(Object.keys(model).reduce((acc, fieldName) => {
        if (dataValues && dataValues[fieldName]) {
            acc[fieldName] = dataValues[fieldName];
        } else {
            acc[fieldName] = model[fieldName].default ?? ""
        }
        return acc;
    }, {}));

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    return (
        <form onSubmit={
            e => e.preventDefault() ||
                onSubmit(Object.keys(values).reduce(
                    (acc, valueKey) => ({...acc, [valueKey]: values[valueKey] !== "" ? values[valueKey] : null}) , {}))
        }>
            {
                Object.keys(model).map(fieldName =>
                    <div key={fieldName}>
                        <label>
                            {model[fieldName].label} :
                            {
                                model[fieldName].type === "select" ?
                                    <select name={fieldName} onChange={handleChange} value={values[fieldName]}>
                                        <option>Choisissez</option>
                                        {
                                            Object.keys(model[fieldName].options).map(optionValue =>
                                                <option key={"option-"+optionValue} value={optionValue}>{model[fieldName].options[optionValue]}</option>
                                            )
                                        }
                                    </select>
                                    :
                                    <input
                                        name={fieldName}
                                        type={model[fieldName].type}
                                        value={values[fieldName]} onChange={handleChange}
                                        {...(model[fieldName].minLength && {minLength: model[fieldName].minLength})}
                                        {...(model[fieldName].maxLength && {maxLength: model[fieldName].maxLength})}
                                    />
                            }
                        </label>
                    </div>
                )
            }
            <input type="submit" value={submitLabel}/>
        </form>
    )
}