// JRM: Role class
class Role {
    constructor(newRole, newRoleSalary, newRoleDept){
      this.newRole = newRole;
      this.newRoleSalary = newRoleSalary;
      this.newRoleDept = newRoleDept;
    }
    getName(){
      return this.newRole;
    }
}

module.exports = Role;
