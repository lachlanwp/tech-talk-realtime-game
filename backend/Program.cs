using RealtimeGame.EventbusMiddleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

List<string> allowedOrigins = new List<string>() { };

var socketOptions = new WebSocketOptions();
foreach (string origin in allowedOrigins)
{
    socketOptions.AllowedOrigins.Add(origin);
}

app.UseWebSockets(socketOptions);
app.UseMiddleware<EventBusMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();