import type { Department, Employee } from "@prisma/client";
import { diff } from "./EntityDiff";
import type { NewDepartment } from "../models/Department";

describe("EntityDiff", () => {
  describe("Simple object with primitive values", () => {
    it("should return diff as all additions with new value", () => {
      const newValue: Employee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
      };

      const result = diff(null, newValue);

      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(5);

      expect(result.patches[0].op).toEqual("add");
      expect(result.patches[0].value).toEqual(1);
      expect(result.patches[0].path).toEqual("/id");

      expect(result.patches[1].op).toEqual("add");
      expect(result.patches[1].value).toEqual("John");
      expect(result.patches[1].path).toEqual("/firstName");

      expect(result.patches[2].op).toEqual("add");
      expect(result.patches[2].value).toEqual("Doe");
      expect(result.patches[2].path).toEqual("/lastName");

      expect(result.patches[3].op).toEqual("add");
      expect(result.patches[3].value).toEqual("johndoe@example.com");
      expect(result.patches[3].path).toEqual("/email");

      expect(result.patches[4].op).toEqual("add");
      expect(result.patches[4].value).toEqual("1234567890");
      expect(result.patches[4].path).toEqual("/phoneNumber");
    });

    it("should return diff as all removals with old value", () => {
      const oldValue: Employee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
      };

      const result = diff(oldValue, null);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(5);
      expect(result.patches[0].op).toEqual("removed");
      expect(result.patches[0].value).toEqual(1);
      expect(result.patches[0].path).toEqual("/id");

      expect(result.patches[1].op).toEqual("removed");
      expect(result.patches[1].value).toEqual("John");
      expect(result.patches[1].path).toEqual("/firstName");

      expect(result.patches[2].op).toEqual("removed");
      expect(result.patches[2].value).toEqual("Doe");
      expect(result.patches[2].path).toEqual("/lastName");

      expect(result.patches[3].op).toEqual("removed");
      expect(result.patches[3].value).toEqual("johndoe@example.com");
      expect(result.patches[3].path).toEqual("/email");

      expect(result.patches[4].op).toEqual("removed");
      expect(result.patches[4].value).toEqual("1234567890");
      expect(result.patches[4].path).toEqual("/phoneNumber");
    });

    it("should return diff with no changes", () => {
      const oldValue: Employee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
      };
      const newValue: Employee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
      };

      const result = diff(oldValue, newValue);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(0);
    });

    it("should return diff with changes", () => {
      const oldValue: Employee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "jonhdoe@exmple.com",
        phoneNumber: "1234567890",
      };

      const newValue: Employee = {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        email: "jonhdoe@gmail.eu",
        phoneNumber: "1234567890",
      };

      const result = diff(oldValue, newValue);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(2);

      expect(result.patches[0].op).toEqual("replace");
      expect(result.patches[0].value).toEqual("Smith");
      expect(result.patches[0].path).toEqual("/lastName");

      expect(result.patches[1].op).toEqual("replace");
      expect(result.patches[1].value).toEqual("jonhdoe@gmail.eu");
      expect(result.patches[1].path).toEqual("/email");
    });
  });

  describe("Complex object with values", () => {
    it("should return diff for new object", () => {
      const newValue: NewDepartment = {
        manager: {
          id: 1,
          email: "manager@example.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
        },
        name: "Engineering",
      };

      const result = diff(null, newValue);

      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(6);

      expect(result.patches[0].op).toEqual("add");
      expect(result.patches[0].value).toEqual(1);
      expect(result.patches[0].path).toEqual("/manager/id");

      expect(result.patches[1].op).toEqual("add");
      expect(result.patches[1].value).toEqual("manager@example.com");
      expect(result.patches[1].path).toEqual("/manager/email");

      expect(result.patches[2].op).toEqual("add");
      expect(result.patches[2].value).toEqual("John");
      expect(result.patches[2].path).toEqual("/manager/firstName");

      expect(result.patches[3].op).toEqual("add");
      expect(result.patches[3].value).toEqual("Doe");
      expect(result.patches[3].path).toEqual("/manager/lastName");

      expect(result.patches[4].op).toEqual("add");
      expect(result.patches[4].value).toEqual("1234567890");
      expect(result.patches[4].path).toEqual("/manager/phoneNumber");

      expect(result.patches[5].op).toEqual("add");
      expect(result.patches[5].value).toEqual("Engineering");
      expect(result.patches[5].path).toEqual("/name");
    });

    it("should return diff for removed object", () => {
      const oldValue: NewDepartment = {
        manager: {
          id: 1,
          email: "manager@example.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
        },
        name: "Engineering",
      };
      const result = diff(oldValue, null);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(6);

      expect(result.patches[0].op).toEqual("removed");
      expect(result.patches[0].value).toEqual(1);
      expect(result.patches[0].path).toEqual("/manager/id");

      expect(result.patches[1].op).toEqual("removed");
      expect(result.patches[1].value).toEqual("manager@example.com");
      expect(result.patches[1].path).toEqual("/manager/email");

      expect(result.patches[2].op).toEqual("removed");
      expect(result.patches[2].value).toEqual("John");
      expect(result.patches[2].path).toEqual("/manager/firstName");

      expect(result.patches[3].op).toEqual("removed");
      expect(result.patches[3].value).toEqual("Doe");
      expect(result.patches[3].path).toEqual("/manager/lastName");

      expect(result.patches[4].op).toEqual("removed");
      expect(result.patches[4].value).toEqual("1234567890");
      expect(result.patches[4].path).toEqual("/manager/phoneNumber");

      expect(result.patches[5].op).toEqual("removed");
      expect(result.patches[5].value).toEqual("Engineering");
      expect(result.patches[5].path).toEqual("/name");
    });

    it("should return diff with no changes for complex object", () => {
      const oldValue: NewDepartment = {
        manager: {
          id: 1,
          email: "manager@example.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
        },
        name: "Engineering",
      };
      const result = diff(oldValue, oldValue);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(0);
    });

    it("should return diff with changes for complex object", () => {
      const oldValue: NewDepartment = {
        manager: {
          id: 1,
          email: "manager@example.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
        },
        name: "Engineering",
      };
      const result = diff(oldValue, oldValue);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(0);
    });

    it("should return diff with changes for complex object", () => {
      const oldValue: NewDepartment = {
        manager: {
          id: 1,
          email: "manager@example.com",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
        },
        name: "Engineering",
      };
      const newValue: NewDepartment = {
        manager: {
          id: 2,
          email: "headofeng@example.com",
          firstName: "Jane",
          lastName: "Smith",
          phoneNumber: "0987654321",
        },
        name: "Engineering",
      };
      const result = diff(oldValue, newValue);
      expect(result).toBeDefined();
      expect(result.patches).toHaveLength(5);

      expect(result.patches[0].op).toEqual("replace");
      expect(result.patches[0].value).toEqual(2);
      expect(result.patches[0].path).toEqual("/manager/id");

      expect(result.patches[1].op).toEqual("replace");
      expect(result.patches[1].value).toEqual("headofeng@example.com");
      expect(result.patches[1].path).toEqual("/manager/email");

      expect(result.patches[2].op).toEqual("replace");
      expect(result.patches[2].value).toEqual("Jane");
      expect(result.patches[2].path).toEqual("/manager/firstName");

      expect(result.patches[3].op).toEqual("replace");
      expect(result.patches[3].value).toEqual("Smith");
      expect(result.patches[3].path).toEqual("/manager/lastName");

      expect(result.patches[4].op).toEqual("replace");
      expect(result.patches[4].value).toEqual("0987654321");
      expect(result.patches[4].path).toEqual("/manager/phoneNumber");
    });
  });
});
