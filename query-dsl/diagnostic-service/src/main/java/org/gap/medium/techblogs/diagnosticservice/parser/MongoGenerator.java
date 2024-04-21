package org.gap.medium.techblogs.diagnosticservice.parser;

import java.util.List;

import org.bson.conversions.Bson;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ASTExpression;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ASTOperator;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.AndExpression;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ConditionExpression;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.Identifier;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.Literal;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.OrExpression;

import com.mongodb.client.model.Filters;

public final class MongoGenerator implements QueryGenerator<Bson> {
    @Override
    public Bson generate(ASTExpression root) {
        return switch (root) {
        case ConditionExpression(QueryParser.ASTOperator operator, QueryParser.Identifier identifier, QueryParser.Literal value) -> toBsonFilter(
                operator, identifier, value);
        case AndExpression(List<ASTExpression> andExprs) -> Filters.and(andExprs.stream().map(this::generate).toList());
        case OrExpression(List<QueryParser.ASTExpression> orExprs) -> Filters.or(
                orExprs.stream().map(this::generate).toList());
        };
    }
    
    private Bson toBsonFilter(ASTOperator operator, Identifier identifier, Literal value) {
        return switch (operator) {
        case EQ -> Filters.eq(identifier.name(), value.value());
        case NEQ -> Filters.ne(identifier.name(), value.value());
        case GT -> Filters.gt(identifier.name(), value.value());
        case LT -> Filters.lt(identifier.name(), value.value());
        };
    }
}
