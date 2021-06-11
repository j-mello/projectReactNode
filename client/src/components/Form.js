import React, {useState} from 'react';

// Example model :
// {
//    email: { type: 'email', label: 'Votre adresse mail', default: 'toto@toto.com' /*optional*/ },
//    password: { type: 'password', label: 'Votre mot de passe'},
//    gender: { type: 'select', label: 'Votre sexe',
//                  options: {
//                      man: 'homme',
//                      woman: 'femme',
//                      yolo: 'yolo',
//                      r2d2: 'r2d2'
//                     }
//            }
// }

export default function Form({model, submitLabel , onSubmit}) {
    const [ values, setValues ] = useState(
        Object.keys(model).reduce((acc, fieldName) => {
            acc[fieldName] = model[fieldName].default ?? ""
            return acc;
        }, {})
    );

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    return (
        <form onSubmit={e => e.preventDefault() || onSubmit(values)}>
            {
                Object.keys(model).map(fieldName =>
                    <div key={fieldName}>
                        <label>
                            {model[fieldName].label} :
                            {
                                model[fieldName].type === "select" ?
                                    <select name={fieldName} onChange={handleChange} value={values[fieldName]}>
                                        {
                                            Object.keys(model[fieldName].options).map(optionValue =>
                                                <option key={"option-"+optionValue} value={optionValue}>{model[fieldName].options[optionValue]}</option>
                                            )
                                        }
                                    </select>
                                    :
                                    <input name={fieldName} type={model[fieldName].type} value={values[fieldName]} onChange={handleChange}/>
                            }
                        </label>
                    </div>
                )
            }
            <input type="submit" value={submitLabel}/>
        </form>
    )
}