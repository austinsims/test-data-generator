# test-data-generator

A simple in-browser app to convert CSV data to an array of C# class instances.  Useful for generating code for unit tests. Will produce syntactically correct literals for C# data types including bool, int, float, DateTime, and string.  Additionally, any empty cells in the CSV data imply nulls in the object initializers. [Give it a try!](http://austinsims.github.io/test-data-generator)

Input:
```
CustomerId,LastName,FirstName,Birthday,LikesCheese
123456,Ortego,,1/2/14,true
234234,Carter,Sean,1/2/14,false
311311,Riley,Terry,1/2/14

```

Output:
```
var sampleCustomers = new[] {
    new Customer() {
        CustomerId = 123456,
        LastName = "Ortego",
        FirstName = null,
        Birthday = Convert.ToDateTime("1/2/14"),
        LikesCheese = true
    },

    new Customer() {
        CustomerId = 234234,
        LastName = "Carter",
        FirstName = "Sean",
        Birthday = Convert.ToDateTime("1/2/14"),
        LikesCheese = false
    },

    new Customer() {
        CustomerId = 311311,
        LastName = "Riley",
        FirstName = "Terry",
        Birthday = Convert.ToDateTime("1/2/14"),
        LikesCheese = null
    }
};

```

