import React, {useEffect, useState} from 'react';
import {TextField, MenuItem, Button} from '@material-ui/core';

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

export default function Form({model, submitLabel, onSubmit, dataValues}) {
    const [values, setValues] = useState(Object.keys(model).reduce((acc, fieldName) => {
        acc[fieldName] = model[fieldName].default ?? "";
        return acc;
    }, {}));

    useEffect(() => {
        setValues(Object.keys(model).reduce((acc, fieldName) => {
            if (dataValues && dataValues[fieldName]) {
                acc[fieldName] = dataValues[fieldName];
            } else {
                acc[fieldName] = model[fieldName].default ?? ""
            }
            return acc;
        }, {}))
    }, [dataValues])

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    return (
        <form style={{ marginTop: "10px" }} onSubmit={
            e => e.preventDefault() ||
                onSubmit(Object.keys(values).reduce(
                    (acc, valueKey) => ({...acc, [valueKey]: values[valueKey] !== "" ? values[valueKey] : null}), {}))
        }>
            {
                Object.keys(model).map(fieldName =>
                    <div key={fieldName}>
                        {
                            model[fieldName].type === "select" ?
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label={model[fieldName].label}
                                    onChange={handleChange}
                                    variant="outlined"
                                    name={fieldName}
                                    value={values[fieldName]}
                                    style={{padding: "15px 0px", width: "25rem"}}
                                >{
                                    Object.keys(model[fieldName].options).map(optionValue =>
                                        <MenuItem
                                            key={"option-" + optionValue}
                                            value={optionValue}>
                                            {model[fieldName].options[optionValue]}
                                        </MenuItem>
                                    )
                                }
                                </TextField>
                                :
                                <TextField
                                    id="outlined-basic"
                                    label={model[fieldName].label}
                                    variant="outlined"
                                    name={fieldName}
                                    type={model[fieldName].type}
                                    value={values[fieldName]} onChange={handleChange}
                                    style={{padding: "15px 0px", width: "25rem"}}
                                    {...(model[fieldName].minLength && {minLength: model[fieldName].minLength})}
                                    {...(model[fieldName].maxLength && {maxLength: model[fieldName].maxLength})}
                                />
                        }
                    </div>
                )
            }

            <Button
                type="submit"
                value={submitLabel}
                variant="contained"
                color="primary"
                style={{marginBottom: "20px"}}>
                Valider
            </Button>
        </form>
    )
}