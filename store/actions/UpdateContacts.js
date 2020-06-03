import firebase from 'firebase';

export const SET_CONTACTS = "SET_CONTACTS"
export const UPDATE_CONTACTS = "UPDATE_CONTACTS"

export const fetchContacts = () => {
    return async (dispatch) => {
        try {
            const response = await firebase.database().ref("Contacts/").once('value', (snapshot) => {
                snapshot.val()
            })
            let response_1 = []
            for (var i in response.toJSON()) {
                response_1 = response_1.concat(response.toJSON()[i])
            }
            dispatch({
                type: SET_CONTACTS,
                contacts: response_1
            })
        }
        catch(err) {
            throw err
        }
    }
}

export const updateContacts = (newContactId, _id) => {
    return {
        type: UPDATE_CONTACTS,
        newContactId: newContactId,
        _id: _id
    }
}