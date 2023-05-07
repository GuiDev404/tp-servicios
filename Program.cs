using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Ezpeleta2023.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString)); 

// SQLite
// "DefaultConnection": "DataSource=app.db;Cache=Shared"
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlite(connectionString));


builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllersWithViews();

//CONFIGURACION DE USUARIOS
builder.Services.ConfigureApplicationCookie(options =>
{
  // RUTA AL QUE SERA REDIRIGIDO SI NO ESTA LOGUADO 
  options.LoginPath = "/Identity/Account/Login";
  // RUTA AL QUE SERA REDIRIGIDO SI NO TIENE PERMISOS POR ROL
  options.AccessDeniedPath = "/Identity/Account/AccessDenied";
});

builder.Services.Configure<IdentityOptions>(options =>
{
  options.Password.RequireDigit = false;
  options.Password.RequireLowercase = false;
  options.Password.RequireNonAlphanumeric = false;
  options.Password.RequireUppercase = false;
  options.Password.RequiredLength = 6;
  options.Password.RequiredUniqueChars = 0;
});
//FIN CONFIGURACION DE USUARIOS

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseMigrationsEndPoint();
}
else
{
  app.UseExceptionHandler("/Home/Error");
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
