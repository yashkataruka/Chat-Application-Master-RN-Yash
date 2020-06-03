import { UPDATE_USERS, SET_USERS } from "../actions/UpdateUsers"

// const initialState = {
//     users: [
//         {
//             _id: 1, name: "Yash Kataruka", avatar: "https://scontent.fdel21-1.fna.fbcdn.net/v/t31.0-0/p640x640/27500624_1631883743526849_5371185179369120659_o.jpg?_nc_cat=111&_nc_sid=85a577&_nc_ohc=HxC82h-6TjgAX9PHczR&_nc_ht=scontent.fdel21-1.fna&_nc_tp=6&oh=433e35c82605599e6def6a9d1ce587d5&oe=5ED304FC"
//         },
//         {
//             _id: 2, name: "Ali Tariq", avatar: "https://scontent.fdel21-1.fna.fbcdn.net/v/t31.0-8/p960x960/25189021_1953013748048581_6918100668392475287_o.jpg?_nc_cat=109&_nc_sid=85a577&_nc_ohc=ICu0o4ekjSMAX8hcj5V&_nc_ht=scontent.fdel21-1.fna&_nc_tp=6&oh=1a93da0cf27ba73036a797dc30578f40&oe=5EE066BB"
//         },
//         {
//             _id: 3, name: "Kartik Papreja", avatar: "https://scontent.fdel21-1.fna.fbcdn.net/v/t1.0-9/p720x720/75464325_2524448724339623_8456490310300598272_o.jpg?_nc_cat=105&_nc_sid=85a577&_nc_ohc=0W4XOMVBFR4AX-pt9GL&_nc_ht=scontent.fdel21-1.fna&_nc_tp=6&oh=654f38c538d1447898f27a23ed0057e6&oe=5EE0DF03"
//         },
//         {
//             _id: 4, name: "Amey Sunu", avatar: "https://scontent.fdel21-1.fna.fbcdn.net/v/t1.0-9/p960x960/41399513_310508706408091_2800159307935514624_o.jpg?_nc_cat=111&_nc_sid=85a577&_nc_ohc=D84K0LEw-n8AX_vw9MA&_nc_ht=scontent.fdel21-1.fna&_nc_tp=6&oh=a75d2a315b2006bdbf213530f813fc58&oe=5EDE9020"
//         }
//     ]
// }

const initialState = {
    users: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_USERS:
            const users = action.users
            return {
                ...state, 
                users: users
            }
        case UPDATE_USERS:
            const newUser = action.newUser
            return {
                ...state,
                users: state.users.concat(newUsers)
            }
        default: 
            return state
    }
}