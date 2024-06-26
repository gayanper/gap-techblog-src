package org.gap.java.build.rules;

import java.util.List;

import com.google.auto.service.AutoService;
import com.google.errorprone.BugPattern;
import com.google.errorprone.BugPattern.SeverityLevel;
import com.google.errorprone.VisitorState;
import com.google.errorprone.bugpatterns.BugChecker;
import com.google.errorprone.bugpatterns.BugChecker.MethodTreeMatcher;
import com.google.errorprone.matchers.Description;
import com.google.errorprone.util.ASTHelpers;
import com.sun.source.tree.ExpressionStatementTree;
import com.sun.source.tree.MethodTree;
import com.sun.source.tree.StatementTree;
import com.sun.source.tree.VariableTree;
import com.sun.tools.javac.code.Symbol.ClassSymbol;
import com.sun.tools.javac.code.Type;
import com.sun.tools.javac.code.Types;
import com.sun.tools.javac.model.JavacElements;

@BugPattern(name = "MustHaveNetworkAliases",
          summary = "The withNetworkAliases method must be used with a random alias to avoid network collisions in CI.",
          severity = SeverityLevel.ERROR)
@AutoService(BugChecker.class)
public class KubedocNetworkAliasCheck extends BugChecker implements MethodTreeMatcher {
     
     @Override
     public Description matchMethod(MethodTree tree, VisitorState state) {
          Types types = Types.instance(state.context);
          JavacElements elements = JavacElements.instance(state.context);
          ClassSymbol typeElement = elements.getTypeElement("org.testcontainers.containers.GenericContainer");
          Type expectedBaseType = (Type) typeElement.asType();
          
          List<? extends StatementTree> statements = tree.getBody().getStatements();
          MethodTreeVisitor visitor = new MethodTreeVisitor("withNetworkAliases");
          for (StatementTree statement : statements) {
               switch (statement.getKind()) {
               case VARIABLE: {
                    VariableTree variableTree = (VariableTree) statement;
                    Type varType = ASTHelpers.getType(variableTree.getType());
                    if (types.isAssignable(types.erasure(varType), expectedBaseType)) {
                         variableTree.getInitializer().accept(visitor, null);
                    }
                    break;
               }
               case EXPRESSION_STATEMENT: {
                    ExpressionStatementTree expressionStatement = (ExpressionStatementTree) statement;
                    Type resultType = ASTHelpers.getResultType(expressionStatement.getExpression());
                    if (types.isAssignable(types.erasure(resultType), expectedBaseType)) {
                         expressionStatement.accept(visitor, null);
                    }
                    break;
               }
               default: {
                    // do nothing
               }
               }
               if (visitor.isFound()) {
                    break; // break out of the loop since we already found
                           // what we are looking for.
               }
          }
          if (visitor.isVisited() && !visitor.isFound()) {
               return buildDescription(tree).setMessage(
                         String.format("The method %s must include a network alias on the testcontainers.", tree.getName())).build();
          }
          return Description.NO_MATCH;
     }
}
