using Microsoft.AspNetCore.Http.Connections;
using stl;
using stl.Code;
using stl.Repository;

var policyName = "AllowAll";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
});
builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);
builder.Services.AddSingleton<RepositoryBase>();
builder.Services.AddTransient<IRepositoryBase, RepositoryBase>();
builder.Services.AddSignalR();
builder.Services.AddScoped<PathHub>();
builder.Services.Configure<ConnectionString>(builder.Configuration.GetSection("ConnectionStrings"));
builder.Services.AddCors(options => 
{
    options.AddPolicy(policyName, builder =>
    {
            builder.AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials();
    });
});


var app = builder.Build();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseDeveloperExceptionPage();
    app.UseCors(policyName);
}

app.Use((context, next) =>
{
    return next(context);
});

app.UseStaticFiles();
app.UseRouting();
app.UseCors(policyName);
app.Urls.Add("http://*:5005");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapHub<PathHub>("/hub", options =>
{
    options.Transports = HttpTransportType.WebSockets | HttpTransportType.LongPolling;
    options.CloseOnAuthenticationExpiration = true;
    options.WebSockets.CloseTimeout = TimeSpan.FromSeconds(3);
    options.LongPolling.PollTimeout = TimeSpan.FromSeconds(10);
});

app.MapFallbackToFile("index.html");

app.Run();
