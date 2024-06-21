using stl.Code;
using stl.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
});
builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<RepositoryBase>();
builder.Services.AddTransient<IRepositoryBase, RepositoryBase>();
builder.Services.Configure<ConnectionString>(builder.Configuration.GetSection("ConnectionStrings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.Use((context, next) =>
{
    return next(context);
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.Urls.Add("http://localhost:5003");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}/{idPhoto?}");

app.MapFallbackToFile("index.html");

app.Run();
