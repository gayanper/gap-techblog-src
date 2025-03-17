package org.gap.userportal.userservice;

import java.io.File;
import java.nio.file.Paths;

import org.jboss.modules.LocalModuleLoader;
import org.jboss.modules.ModuleClassLoader;
import org.jboss.modules.ModuleLoadException;
import org.jboss.modules.ModuleLoader;

public class Main {
    public static void main(String[] args) throws ModuleLoadException, ClassNotFoundException {
        // Define the module path
        String modulePath = Paths.get("aggregate/user-service/modules").toAbsolutePath().toString();
        ModuleLoader moduleLoader = new LocalModuleLoader(new File[]{new File(modulePath)});

        // Load the module
        org.jboss.modules.Module module = moduleLoader.loadModule("lambda_create_user" );

        // Get the class loader of the module
        ModuleClassLoader classLoader = module.getClassLoader();
        Class<?> clazz = classLoader.loadClass("gap.aws.functions.App");
        System.out.println(clazz.getName());
    }
}
