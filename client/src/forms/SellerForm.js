export default (register = true) =>
    ({
        siren: {type: 'text', label: 'Votre siren', minLength: 9, maxLength: 9},
        society: {type: 'text', label: 'Votre société'},
        urlRedirectConfirm: {type: 'text', label: 'L\'Url de redirection'},
        urlRedirectCancel: {type: 'text', label: 'L\'Url d\'annulation'},
        currency: {type: 'text', label: 'La devise'},
        email: {type: 'email', label: 'Votre adresse mail'},
        ...(register && {password: {type: 'password', label: 'Votre mot de passe'}}),
        numPhone: {type: 'phone', label: 'Numéro de téléphone'}
    })
;
