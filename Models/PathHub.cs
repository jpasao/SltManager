using Microsoft.AspNetCore.SignalR;

namespace stl.Models;

public class PathHub : Hub
{
    public async Task SendPath(string path) => await Clients.All.SendAsync("stlLinkHub", path);
}
