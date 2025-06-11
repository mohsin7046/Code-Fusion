const languageOptions = {
    javascript: "18.3",
    python: "3.9",
    java: "11",
    c: "11",
    cpp: "11",
    go: "1.17",
    rust: "1.57",
    typescript: "4.4",
}

const codeSnippets = {
    javascript: `function greet() {
    console.log('Hello, World!');
}`,
    python: `def greet():
    print('Hello, World!')`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    c: `#include <stdio.h>
int main() {
    printf("Hello, World!");
    return 0;
}`,
    cpp: `#include <iostream>
int main() {

    std::cout << "Hello, World!";
    return 0;
}`,
    go: `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,
    rust: `fn main() {
    println!("Hello, World!");
}`,
    typescript: `function greet() {
    console.log('Hello, World!');
}`,
}

const langFiles = {
    javascript: "js",
    python: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
    go: "go",
    rust: "rs",
    typescript: "ts"
}

export  {languageOptions, codeSnippets,langFiles};