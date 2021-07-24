export default (register = false,seller = false, currencies = []) =>
    ({
            ...(seller ? {
                    siren: {type: 'text', label: 'Votre siren', minLength: 9, maxLength: 9},
                    society: {type: 'text', label: 'Votre société'},
                    urlRedirectConfirm: {type: 'text', label: 'L\'Url de redirection'},
                    urlRedirectCancel: {type: 'text', label: 'L\'Url d\'annulation'},
                    currency: { type: 'select', label: 'Votre devise',
                          options: currencies.reduce((acc,currency) =>
                                  ({...acc, [currency]: currency})
                          , {})
                    }
            } : {}),
            ...(register && {
                    password: {type: 'password', label: 'Votre mot de passe'},
                    email: {type: 'email', label: 'Votre adresse mail'}
            }),
            numPhone: {type: 'phone', label: 'Numéro de téléphone'}
    })
;
