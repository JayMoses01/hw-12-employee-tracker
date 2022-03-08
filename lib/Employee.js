// JRM: Employee class
class Employee {
    constructor(empFirstName, empLastName, empRole, empMgr){
      this.empFirstName = empFirstName;
      this.empLastName = empLastName;
      this.empRole = empRole;
      this.empMgr = empMgr;
    }
    getFirstName(){
      return this.empFirstName;
    }
    getLastName(){
      return this.empLastName;
    }
    getEmpRole(){
      return this.empRole;
    }
}

module.exports = Employee;
