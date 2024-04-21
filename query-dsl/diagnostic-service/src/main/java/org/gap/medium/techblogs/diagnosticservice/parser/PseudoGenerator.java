package org.gap.medium.techblogs.diagnosticservice.parser;

import java.util.List;

import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ASTExpression;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ASTOperator;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.AndExpression;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ConditionExpression;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.Identifier;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.Literal;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.LogicalOperator;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.OrExpression;

import jakarta.annotation.Nullable;

public final class PseudoGenerator implements QueryGenerator<String> {
    
    private static final String SPACE = " ";
    
    @Override
    public String generate(ASTExpression root) {
        StringBuilder pseudoString = new StringBuilder();
        generate(List.of(root), pseudoString, null);
        return pseudoString.toString();
    }
    
    private void generate(List<ASTExpression> expressions, StringBuilder pseudoString, @Nullable LogicalOperator lop) {
        for (int i = 0; i < expressions.size(); i++) {
            var expr = expressions.get(i);
            switch (expr) {
            case OrExpression(List<ASTExpression> orExprs):
                pseudoString.append("(");
                generate(orExprs, pseudoString, LogicalOperator.OR);
                pseudoString.append(")");
                break;
            case AndExpression(List<ASTExpression> andExprs):
                pseudoString.append("(");
                generate(andExprs, pseudoString, LogicalOperator.AND);
                pseudoString.append(")");
                break;
            case ConditionExpression(ASTOperator operator, Identifier identifier, Literal value):
                pseudoString.append(identifier.name()).append(SPACE).append(opString(operator)).append(SPACE).append(
                        value.value());
                break;
            default:
                throw new UnsupportedOperationException("%s expression not supported.".formatted(expr));
            }
            if (lop != null && i < (expressions.size() - 1)) {
                pseudoString.append(SPACE).append(lop.name()).append(SPACE);
            }
        }
    }
    
    private String opString(ASTOperator operator) {
        return switch (operator) {
        case EQ -> "=";
        case NEQ -> "!=";
        case GT -> ">";
        case LT -> "<";
        };
    }
    
}
