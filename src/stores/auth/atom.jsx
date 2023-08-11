import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    isSignedIn: false,
    /**
     * @type {{
     *  email:string,
     *  emailToken:string,
     *  id:number,
     *  isActive:boolean,
     *  name:string,
     * } | null}
     */
    userData: null,
  },
});
