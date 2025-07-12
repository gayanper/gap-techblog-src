import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AssignEmployeeResponse = {
  __typename?: "AssignEmployeeResponse";
  assignment: Assignment;
  previousAssignment?: Maybe<Assignment>;
};

export type Assignment = {
  __typename?: "Assignment";
  department: Department;
  employee: Employee;
  endDate?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  startDate: Scalars["String"]["output"];
};

export type Department = {
  __typename?: "Department";
  id: Scalars["ID"]["output"];
  manager: Employee;
  name: Scalars["String"]["output"];
};

export type Employee = {
  __typename?: "Employee";
  assignments?: Maybe<Array<Assignment>>;
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastName: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
};

export type EndAssignment = {
  endDate: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
};

export enum EntityAction {
  Changed = "CHANGED",
  Created = "CREATED",
  Deleted = "DELETED",
}

export type EntityHistory = {
  __typename?: "EntityHistory";
  action: EntityAction;
  changedAt: Scalars["String"]["output"];
  changedBy: Scalars["String"]["output"];
  diffsJsonString: Scalars["String"]["output"];
  entityId: Scalars["ID"]["output"];
  entityType: EntityType;
  id: Scalars["ID"]["output"];
  snapshotJsonString: Scalars["String"]["output"];
};

export enum EntityType {
  Assignment = "ASSIGNMENT",
  Department = "DEPARTMENT",
  Employee = "EMPLOYEE",
}

export enum JsonPathOperation {
  Add = "ADD",
  Removed = "REMOVED",
  Replace = "REPLACE",
}

export type Mutation = {
  __typename?: "Mutation";
  assignEmployee: AssignEmployeeResponse;
  createDepartment: Department;
  createEmployee: Employee;
  deleteDepartment: Scalars["Boolean"]["output"];
  deleteEmployee: Scalars["Boolean"]["output"];
  endEmployeeAssignment: Assignment;
  updateDepartment: Department;
  updateEmployee: Employee;
};

export type MutationAssignEmployeeArgs = {
  input: NewAssignment;
};

export type MutationCreateDepartmentArgs = {
  input: NewDepartment;
};

export type MutationCreateEmployeeArgs = {
  input: NewEmployee;
};

export type MutationDeleteDepartmentArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteEmployeeArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationEndEmployeeAssignmentArgs = {
  input: EndAssignment;
};

export type MutationUpdateDepartmentArgs = {
  input: UpdateDepartment;
};

export type MutationUpdateEmployeeArgs = {
  input: UpdateEmployee;
};

export type NewAssignment = {
  departmentId: Scalars["ID"]["input"];
  employeeId: Scalars["ID"]["input"];
};

export type NewDepartment = {
  managerId: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type NewEmployee = {
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  lastName: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  assignment: Assignment;
  department: Department;
  departments: Array<Department>;
  employee: Employee;
  employees: Array<Employee>;
  history: Array<EntityHistory>;
};

export type QueryAssignmentArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryDepartmentArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryEmployeeArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryHistoryArgs = {
  entityId: Scalars["ID"]["input"];
  entityType: EntityType;
};

export type UpdateDepartment = {
  id: Scalars["ID"]["input"];
  managerId: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type UpdateEmployee = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  lastName?: InputMaybe<Scalars["String"]["input"]>;
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AssignEmployeeResponse: ResolverTypeWrapper<AssignEmployeeResponse>;
  Assignment: ResolverTypeWrapper<Assignment>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Department: ResolverTypeWrapper<Department>;
  Employee: ResolverTypeWrapper<Employee>;
  EndAssignment: EndAssignment;
  EntityAction: EntityAction;
  EntityHistory: ResolverTypeWrapper<EntityHistory>;
  EntityType: EntityType;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  JsonPathOperation: JsonPathOperation;
  Mutation: ResolverTypeWrapper<{}>;
  NewAssignment: NewAssignment;
  NewDepartment: NewDepartment;
  NewEmployee: NewEmployee;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  UpdateDepartment: UpdateDepartment;
  UpdateEmployee: UpdateEmployee;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AssignEmployeeResponse: AssignEmployeeResponse;
  Assignment: Assignment;
  Boolean: Scalars["Boolean"]["output"];
  Department: Department;
  Employee: Employee;
  EndAssignment: EndAssignment;
  EntityHistory: EntityHistory;
  ID: Scalars["ID"]["output"];
  Mutation: {};
  NewAssignment: NewAssignment;
  NewDepartment: NewDepartment;
  NewEmployee: NewEmployee;
  Query: {};
  String: Scalars["String"]["output"];
  UpdateDepartment: UpdateDepartment;
  UpdateEmployee: UpdateEmployee;
};

export type AssignEmployeeResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["AssignEmployeeResponse"] = ResolversParentTypes["AssignEmployeeResponse"]
> = {
  assignment?: Resolver<ResolversTypes["Assignment"], ParentType, ContextType>;
  previousAssignment?: Resolver<
    Maybe<ResolversTypes["Assignment"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssignmentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Assignment"] = ResolversParentTypes["Assignment"]
> = {
  department?: Resolver<ResolversTypes["Department"], ParentType, ContextType>;
  employee?: Resolver<ResolversTypes["Employee"], ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DepartmentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Department"] = ResolversParentTypes["Department"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  manager?: Resolver<ResolversTypes["Employee"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Employee"] = ResolversParentTypes["Employee"]
> = {
  assignments?: Resolver<
    Maybe<Array<ResolversTypes["Assignment"]>>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phoneNumber?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityHistoryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["EntityHistory"] = ResolversParentTypes["EntityHistory"]
> = {
  action?: Resolver<ResolversTypes["EntityAction"], ParentType, ContextType>;
  changedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  changedBy?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  diffsJsonString?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes["EntityType"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  snapshotJsonString?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  assignEmployee?: Resolver<
    ResolversTypes["AssignEmployeeResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationAssignEmployeeArgs, "input">
  >;
  createDepartment?: Resolver<
    ResolversTypes["Department"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateDepartmentArgs, "input">
  >;
  createEmployee?: Resolver<
    ResolversTypes["Employee"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateEmployeeArgs, "input">
  >;
  deleteDepartment?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDepartmentArgs, "id">
  >;
  deleteEmployee?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteEmployeeArgs, "id">
  >;
  endEmployeeAssignment?: Resolver<
    ResolversTypes["Assignment"],
    ParentType,
    ContextType,
    RequireFields<MutationEndEmployeeAssignmentArgs, "input">
  >;
  updateDepartment?: Resolver<
    ResolversTypes["Department"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateDepartmentArgs, "input">
  >;
  updateEmployee?: Resolver<
    ResolversTypes["Employee"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateEmployeeArgs, "input">
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  assignment?: Resolver<
    ResolversTypes["Assignment"],
    ParentType,
    ContextType,
    RequireFields<QueryAssignmentArgs, "id">
  >;
  department?: Resolver<
    ResolversTypes["Department"],
    ParentType,
    ContextType,
    RequireFields<QueryDepartmentArgs, "id">
  >;
  departments?: Resolver<
    Array<ResolversTypes["Department"]>,
    ParentType,
    ContextType
  >;
  employee?: Resolver<
    ResolversTypes["Employee"],
    ParentType,
    ContextType,
    RequireFields<QueryEmployeeArgs, "id">
  >;
  employees?: Resolver<
    Array<ResolversTypes["Employee"]>,
    ParentType,
    ContextType
  >;
  history?: Resolver<
    Array<ResolversTypes["EntityHistory"]>,
    ParentType,
    ContextType,
    RequireFields<QueryHistoryArgs, "entityId" | "entityType">
  >;
};

export type Resolvers<ContextType = any> = {
  AssignEmployeeResponse?: AssignEmployeeResponseResolvers<ContextType>;
  Assignment?: AssignmentResolvers<ContextType>;
  Department?: DepartmentResolvers<ContextType>;
  Employee?: EmployeeResolvers<ContextType>;
  EntityHistory?: EntityHistoryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};
