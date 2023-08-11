/**
 * @typedef {Object} Friend
 * @property {number} id
 * @property {string} profileImage
 * @property {string} name
 * @property {string[]=} allergics
 */

/**
 * @typedef {{
 *  id:number,
 *  name:string,
 *  materials: {id:number,name:string}[],
 *  allergies: {id:number,name:string}[],
 *  ingredients: {id:number,name:string}[],
 *  diaries: any[],
 *  category?: 'family'|'friend',
 * }} Person
 */

/**
 * @typedef {Object} Contacts
 * @property {Person[]} family
 * @property {Person[]} friend
 */

/**
 * @typedef {{
 *      category:string,
 *      items:Friend[]
 * }} FriendList
 */
