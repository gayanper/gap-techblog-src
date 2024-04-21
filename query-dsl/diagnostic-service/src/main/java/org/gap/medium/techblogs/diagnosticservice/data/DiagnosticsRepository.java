package org.gap.medium.techblogs.diagnosticservice.data;

import static com.mongodb.client.model.Aggregates.addFields;
import static com.mongodb.client.model.Aggregates.lookup;
import static com.mongodb.client.model.Aggregates.match;
import static com.mongodb.client.model.Aggregates.project;
import static com.mongodb.client.model.Aggregates.unwind;
import static com.mongodb.client.model.Projections.exclude;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.gap.medium.techblogs.diagnosticservice.models.DemographicData;
import org.gap.medium.techblogs.diagnosticservice.models.DiagnosisEntry;
import org.gap.medium.techblogs.diagnosticservice.models.Gender;

import com.mongodb.client.MongoClient;
import com.mongodb.client.model.Field;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DiagnosticsRepository {
    private static final String DB_NAME = "dstats";
    private static final String ENTRY_COLLECTION_NAME = "dentries";
    private static final String DEMOGRAPHICS_COLLECTION_NAME = "demographics";
    
    private MongoClient client;
    
    public DiagnosticsRepository(MongoClient client) {
        this.client = client;
    }
    
    public List<DiagnosisEntry> find(Bson filter) {
        var collection = client.getDatabase(DB_NAME).getCollection(ENTRY_COLLECTION_NAME);
        
        var pipeline = new ArrayList<Bson>();
        pipeline.add(lookup(DEMOGRAPHICS_COLLECTION_NAME, "city_of_residence", "city", "demographic"));
        pipeline.add(unwind("$demographic"));
        pipeline.add(addFields(new Field<String>("population", "$demographic.total_population")));
        pipeline.add(project(exclude("demographic")));
        pipeline.add(match(filter));
        return collection.aggregate(pipeline).map(this::toEntry).into(new ArrayList<>());
    }
    
    private DiagnosisEntry toEntry(Document doc) {
        // add resolving demographic data later.
        return new DiagnosisEntry(doc.getString("diagnosis_code"), LocalDate.parse(doc.getString("registration_date")),
                doc.getInteger("age_at_diagnose"), doc.getInteger("birth_year"), toGender(doc.getString("gender")),
                doc.getBoolean("married"),
                new DemographicData(doc.getString("city_of_residence"), doc.getInteger("population")));
    }
    
    private Gender toGender(String dbValue) {
        return "F".equalsIgnoreCase(dbValue) ? Gender.FEMALE : Gender.MALE;
    }
}
