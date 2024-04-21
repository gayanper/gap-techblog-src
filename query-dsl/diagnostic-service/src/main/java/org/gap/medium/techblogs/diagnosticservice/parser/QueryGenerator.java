package org.gap.medium.techblogs.diagnosticservice.parser;

import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser.ASTExpression;

public sealed interface QueryGenerator<Q> permits PseudoGenerator, MongoGenerator {
    Q generate(ASTExpression root);
}
