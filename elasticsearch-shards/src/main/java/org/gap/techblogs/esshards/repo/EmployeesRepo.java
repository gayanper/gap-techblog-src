package org.gap.techblogs.esshards.repo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

import io.vertx.mutiny.mysqlclient.MySQLPool;
import io.vertx.mutiny.sqlclient.Row;
import io.vertx.mutiny.sqlclient.RowSet;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class EmployeesRepo {
    private MySQLPool client;
    
    private static final String ALL = """
            SELECT e.emp_no, e.first_name, e.last_name, e.gender, e.hire_date, e.birth_date
                FROM employees e""";
    
    private static final String LIMIT = """
            SELECT e.emp_no, e.first_name, e.last_name, e.gender, e.hire_date, e.birth_date
                FROM employees e LIMIT ?""";
    @Inject
    public EmployeesRepo(MySQLPool client) {
        this.client = client;
    }
    
    public List<Map<String, Object>> loadAll(int sizeToLoad) {
        if(sizeToLoad > 0) {
            return toListOfMaps(client.preparedQuery(LIMIT).executeAndAwait(Tuple.of(sizeToLoad)));
        }
        return toListOfMaps(client.query(ALL).executeAndAwait());
    }
    
    private List<Map<String, Object>> toListOfMaps(RowSet<Row> rows) {
        return StreamSupport.stream(rows.spliterator(), false).map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("empNo", row.getValue("emp_no"));
            map.put("firstName", row.getValue("first_name"));
            map.put("lastName", row.getValue("last_name"));
            map.put("gender", row.getValue("gender"));
            map.put("hireDate", row.getValue("hire_date"));
            map.put("birthDate", row.getValue("birth_date"));
            return map;
        }).toList();
    }
}
