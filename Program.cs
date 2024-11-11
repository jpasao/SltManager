using Microsoft.AspNetCore.Http.Connections;
using stl.Models;
using stl.Code;
using stl.Repositories;
using stl.Interfaces;
using System.Text.Json.Serialization;

var policyName = "AllowAll";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.ClearProviders().AddConsole();
builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.Converters.Add(new JsonException());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddSingleton<CollectionRepository>();
builder.Services.AddTransient<ICollectionRepository, CollectionRepository>();
builder.Services.AddSingleton<PatreonRepository>();
builder.Services.AddTransient<IPatreonRepository, PatreonRepository>();
builder.Services.AddSingleton<StlModelRepository>();
builder.Services.AddTransient<IStlModelRepository, StlModelRepository>();
builder.Services.AddSingleton<TagRepository>();
builder.Services.AddTransient<ITagRepository, TagRepository>();
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
app.Urls.Add("http://*:5006");


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
