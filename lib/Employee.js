// JRM: Employee class
class Employee {
    constructor(empFirstName, empLastName, empRole, empMgr){
      this.empFirstName = empFirstName;
      this.empLastName = empLastName;
      this.empRole = empRole;
      this.empMgr = empMgr;
    }
    getName(){
      return this.empFirstName + empLastName;
    }
}

module.exports = Employee;
