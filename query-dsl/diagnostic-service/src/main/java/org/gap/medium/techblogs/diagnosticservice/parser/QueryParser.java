package org.gap.medium.techblogs.diagnosticservice.parser;

import java.util.ArrayList;
import java.util.List;

import org.gap.medium.techblogs.diagnosticservice.models.EqualQuery;
import org.gap.medium.techblogs.diagnosticservice.models.EqualityExpr;
import org.gap.medium.techblogs.diagnosticservice.models.GreaterThan;
import org.gap.medium.techblogs.diagnosticservice.models.LessThan;
import org.gap.medium.techblogs.diagnosticservice.models.MatchAllQuery;
import org.gap.medium.techblogs.diagnosticservice.models.MatchAnyQuery;
import org.gap.medium.techblogs.diagnosticservice.models.NotEqualQuery;
import org.gap.medium.techblogs.diagnosticservice.models.Query;
import org.gap.medium.techblogs.diagnosticservice.models.Range;
import org.gap.medium.techblogs.diagnosticservice.models.RangeQuery;
import org.gap.medium.techblogs.diagnosticservice.models.RangeValue;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class QueryParser {
    public enum ASTOperator {
        EQ, NEQ, GT, LT
    }
    
    public enum LogicalOperator {
        AND, OR
    }
    
    public sealed interface ASTElement permits Literal, Identifier, ASTExpression {
    }
    
    public sealed interface ASTExpression extends ASTElement permits AndExpression, OrExpression, ConditionExpression {
        
    }
    
    public record Literal(Object value) implements ASTElement {
        
    }
    
    public record Identifier(String name) implements ASTElement {
        
    }
    
    public record AndExpression(List<ASTExpression> expressions) implements ASTExpression {
    }
    
    public record OrExpression(List<ASTExpression> expressions) implements ASTExpression {
    }
    
    public record ConditionExpression(ASTOperator operator, Identifier identifier, Literal value)
            implements ASTExpression {
    }
    
    public <O> O parse(Query query, QueryGenerator<O> generator) {
        var elements = new ArrayList<ASTExpression>();
        parse(query, elements);
        if (elements.isEmpty()) {
            throw new IllegalStateException("No root expression available, possibly a empty query");
        }
        return generator.generate(elements.get(0));
    }
    
    private static void parse(Query query, List<ASTExpression> expressions) {
        switch (query) {
        case MatchAllQuery all: {
            List<ASTExpression> andExpressions = new ArrayList<>(all.matchAll().size());
            all.matchAll().forEach(q -> parse(q, andExpressions));
            expressions.add(new AndExpression(andExpressions));
            break;
        }
        case MatchAnyQuery any: {
            List<ASTExpression> andExpressions = new ArrayList<>(any.matchAny().size());
            any.matchAny().forEach(q -> parse(q, andExpressions));
            expressions.add(new OrExpression(andExpressions));
            break;
        }
        case EqualQuery(EqualityExpr eqExpr): {
            expressions.add(new ConditionExpression(ASTOperator.EQ,
                    new Identifier(eqExpr.attribute().name().toLowerCase()), new Literal(eqExpr.value())));
            break;
        }
        case NotEqualQuery(EqualityExpr eqExpr): {
            expressions.add(new ConditionExpression(ASTOperator.NEQ,
                    new Identifier(eqExpr.attribute().name().toLowerCase()), new Literal(eqExpr.value())));
            break;
        }
        case RangeQuery(Range range): {
            range.values().forEach(op -> {
                switch (op) {
                case LessThan(RangeValue rv): {
                    expressions.add(new ConditionExpression(ASTOperator.LT,
                            new Identifier(range.attribute().name().toLowerCase()), new Literal(rv.value())));
                    break;
                }
                case GreaterThan(RangeValue rv): {
                    expressions.add(new ConditionExpression(ASTOperator.GT,
                            new Identifier(range.attribute().name().toLowerCase()), new Literal(rv.value())));
                    break;
                }
                default: {
                    throw new UnsupportedOperationException("%s is not a supported range operation.".formatted(op));
                }
                }
            });
            break;
        }
        default: {
            throw new UnsupportedOperationException("%s is not a supported query.".formatted(query));
        }
        }
    }
    
}
