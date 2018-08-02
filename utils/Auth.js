import axios from 'axios';
import cookie from 'js-cookie';

class Auth {
    static async getUser(token, req) {
        const url = req ? `${req.protocol}://${req.get('Host')}` : '';
        return new Promise((resolve, reject) => {
            axios.get(`${url}/api/auth/users/${token}`).then(results => {
                let { user } = results.data;
                resolve(user);
            }).catch(error => { reject(error) });
        });
    }
}
export default Auth;