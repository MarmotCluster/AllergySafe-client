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
 * @property {APIStaticItemDefault[]} foods
 * @property {APIStaticItemDefault[]} medicines
 * @property {APIStaticItemDefault[]} symptoms
 */

/* DIARY */

/**
 * @typedef {Object} Diary
 * @property {string} date - The date of the diary entry.
 * @property {number} id - The unique identifier of the diary entry.
 * @property {Array<IngestedFood>} ingestedFoods - An array of ingested food information.
 * @property {Array<any>} occuredSymptoms - An array of occurred symptoms.
 * @property {Array<any>} takenMedicines - An array of taken medicines.
 */

/**
 * @typedef {Object} IngestedFood
 * @property {number} id - The unique identifier of the ingested food.
 * @property {string} datetime - The date and time the food was ingested.
 * @property {Food} food - The details of the ingested food.
 */

/**
 * @typedef {Object} Food
 * @property {Array<Allergy>} allergies - An array of allergies related to the food.
 * @property {string} barcode - The barcode of the food.
 * @property {number} id - The unique identifier of the food.
 * @property {Array<Material>} materials - An array of materials used in the food.
 * @property {string} name - The name of the food.
 */

/**
 * @typedef {Object} Allergy
 * @property {number} id - The unique identifier of the allergy.
 * @property {string} name - The name of the allergy.
 */

/**
 * @typedef {Object} Material
 * @property {number} id - The unique identifier of the material.
 * @property {string} name - The name of the material.
 */
