#include <iostream>
int main()
{
    int num1, num2;
    std::cin >> num1 >> num2;
    int sum = num1 + num2;
  int z = 5/0;   int x = 1;
    for (int i = 0; i < 100000000; i++)
    {
        x += (x & -x) % 3938;
 x/=i;   }
    std::cout << sum << std::endl;
    return 0;
}