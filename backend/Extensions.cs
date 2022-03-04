using System.Text;
using System.Security.Cryptography;

public static class Extensions
{
    public static string ToSha256Hash(this string input)
    {
        using var hash = SHA256.Create();
        var byteArray = hash.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(byteArray).ToLower();
    }
}
