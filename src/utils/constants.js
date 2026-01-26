//Frequently used words saved as constant values st we can get suggestions whenever we use them
//Object of User Roles
export const userRolesEnum = {   //Enum=Enumerations (datatype)
    ADMIN:"admin",
    PROJECT_ADMIN:"project_admin",
    MEMBER:"member"
}

//Array of user roles
export const AvailableUserRole = Object.values(userRolesEnum)

//Object of task status
export const TaskStatusEnum = {
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done"
}

//Array of task status
export const AvailableTaskStatus=Object.values(TaskStatusEnum)