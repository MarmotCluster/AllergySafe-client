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
 *  imageUrl: string,
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

/**
 * @typedef {{id:number, label?:string, name?:string}} APIStaticItemDefault
 */

/**
 * @typedef {Object} AutocompleteList
 * @property {APIStaticItemDefault[]} materials
 * @property {APIStaticItemDefault[]} allergies
 * @property {APIStaticItemDefault[]} ingredients
 */
