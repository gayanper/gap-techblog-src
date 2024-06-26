package org.gap.java.build.rules;

import com.google.errorprone.util.ASTHelpers;
import com.sun.source.tree.MethodInvocationTree;
import com.sun.source.util.TreeScanner;
import com.sun.tools.javac.code.Symbol.MethodSymbol;

public class MethodTreeVisitor extends TreeScanner<Void, Void> {
    private String methodName;
    private boolean found = false;
    private boolean visited = false;

    public MethodTreeVisitor(String methodName) {
        this.methodName = methodName;
    }

    @Override
    public Void visitMethodInvocation(MethodInvocationTree node, Void p) {
        this.visited = true;
        if (found) {
            return null;
        }
        MethodSymbol symbol = ASTHelpers.getSymbol(node);

        if (symbol.getSimpleName().contentEquals(methodName)) {
            found = true;
        }
        return super.visitMethodInvocation(node, p);
    }

    public boolean isFound() {
        return found;
    }

    public boolean isVisited() {
        return visited;
    }
}
