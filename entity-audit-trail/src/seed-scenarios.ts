/**
 * Generated using Copilot
 * 
 * Seed scenario script
 * Calls the running GraphQL server to simulate a series of operations.
 *
 * Default endpoint: http://localhost:4000/graphql
 * You can override via env GRAPHQL_URL and set SEED_USER_ID for x-user-id header.
 */

import fetch from "cross-fetch";

type GqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:4000/graphql";
const USER_ID = process.env.SEED_USER_ID || "seed-script";

async function gqlRequest<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-id": USER_ID,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const json = (await res.json()) as GqlResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }
  if (!json.data) {
    throw new Error("No data returned from GraphQL endpoint");
  }
  return json.data;
}

async function main() {
  console.log(`Using GraphQL endpoint: ${GRAPHQL_URL}`);

  // 1) Create Employee: Kari Johnsson
  const createEmployeeMutation = `
		mutation CreateEmployee($input: NewEmployee!) {
			createEmployee(input: $input) {
				id
				firstName
				lastName
				email
				phoneNumber
			}
		}
	`;

  const { createEmployee: kari } = await gqlRequest<{
    createEmployee: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  }>(createEmployeeMutation, {
    input: {
      firstName: "Kari",
      lastName: "Johnsson",
      email: "kari@example.com",
      phoneNumber: "+476543218",
    },
  });
  console.log(`Created employee Kari: id=${kari.id}`);

  // 2) Create Department: Science, manager = Kari
  const createDepartmentMutation = `
		mutation CreateDepartment($input: NewDepartment!) {
			createDepartment(input: $input) {
				id
				name
				manager { id }
			}
		}
	`;

  const { createDepartment: science } = await gqlRequest<{
    createDepartment: { id: string; name: string; manager: { id: string } };
  }>(createDepartmentMutation, {
    input: { name: "Science", managerId: kari.id },
  });
  console.log(
    `Created department Science: id=${science.id}, managerId=${science.manager.id}`
  );

  // 3) Create Employee: Ole Olard
  const { createEmployee: ole } = await gqlRequest<{
    createEmployee: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  }>(createEmployeeMutation, {
    input: {
      firstName: "Ole",
      lastName: "Olard",
      email: "ole@exampl.com",
      phoneNumber: "+4787654321",
    },
  });
  console.log(`Created employee Ole: id=${ole.id}`);

  // 4) Assign Ole to Science
  const assignEmployeeMutation = `
		mutation AssignEmployee($input: NewAssignment!) {
			assignEmployee(input: $input) {
				assignment {
					id
					startDate
					endDate
					employee { id }
					department { id }
				}
				previousAssignment { id }
			}
		}
	`;

  const { assignEmployee } = await gqlRequest<{
    assignEmployee: {
      assignment: {
        id: string;
        startDate: string;
        endDate: string | null;
        employee: { id: string };
        department: { id: string };
      };
      previousAssignment: { id: string } | null;
    };
  }>(assignEmployeeMutation, {
    input: { employeeId: ole.id, departmentId: science.id },
  });
  console.log(
    `Assigned Ole to Science: assignmentId=${assignEmployee.assignment.id}`
  );

  // 5) Update Kari's last name to "Johansson"
  const updateEmployeeMutation = `
		mutation UpdateEmployee($input: UpdateEmployee!) {
			updateEmployee(input: $input) {
				id
				firstName
				lastName
				email
				phoneNumber
			}
		}
	`;

  const { updateEmployee: updatedKari } = await gqlRequest<{
    updateEmployee: {
      id: string;
      lastName: string;
    };
  }>(updateEmployeeMutation, {
    input: { id: kari.id, lastName: "Johansson" },
  });
  console.log(
    `Updated Kari last name: id=${updatedKari.id}, lastName=${updatedKari.lastName}`
  );

  // 6) End Ole's assignment on Science
  const endAssignmentMutation = `
		mutation EndEmployeeAssignment($input: EndAssignment!) {
			endEmployeeAssignment(input: $input) {
				id
				startDate
				endDate
				employee { id }
				department { id }
			}
		}
	`;

  const nowIso = new Date().toISOString();
  const { endEmployeeAssignment } = await gqlRequest<{
    endEmployeeAssignment: {
      id: string;
      endDate: string | null;
    };
  }>(endAssignmentMutation, {
    input: { id: assignEmployee.assignment.id, endDate: nowIso },
  });
  console.log(
    `Ended Ole assignment: id=${endEmployeeAssignment.id}, endDate=${endEmployeeAssignment.endDate}`
  );

  console.log("Scenario completed successfully.");
}

// Execute when run directly
if (require.main === module) {
  main().catch((err) => {
    console.error("Seed scenario failed:\n", err);
    process.exitCode = 1;
  });
}

export { main };
