'use strict';
const fs = require('fs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up (queryInterface, Sequelize) {
    let query = JSON.parse(fs.readFileSync('./data/category.json','utf-8')).map(el=>{
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
     })
     return queryInterface.bulkInsert('Categories',query,{})
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories',null,{})
  }
};
