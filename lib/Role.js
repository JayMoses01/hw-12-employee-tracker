// JRM: Role class
class Role {
    constructor(newRole, newRoleSalary, newRoleDept){
      this.newRole = newRole;
      this.newRoleSalary = newRoleSalary;
      this.newRoleDept = newRoleDept;
    }
    getRole(){
      return this.newRole;
    }
    getSalary(){
      return this.newRoleSalary;
    }
    getDept(){
      return this.newRoleDept;
    }
}

module.exports = Role;
