using Microsoft.AspNetCore.Mvc;
using ReactNetCoreSTL.Server.Models;

namespace ReactNetCoreSTL.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MainController : ControllerBase
    {
        private readonly ILogger<MainController> _logger;

        public MainController(ILogger<MainController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Main> Get()
        {
            return (IEnumerable<Main>)Ok(new List<Main>());
        }
    }
}
