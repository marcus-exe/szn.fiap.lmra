# Migration Playbook

This document provides guidance on modernizing legacy codebases to modern technologies.

## Table of Contents

1. [Java/Spring Migration](#java-spring-migration)
2. [C#/.NET Migration](#c-net-migration)
3. [Frontend Migration](#frontend-migration)
4. [Android Migration](#android-migration)
5. [Database Migration](#database-migration)
6. [Infrastructure Migration](#infrastructure-migration)

## Java/Spring Migration

### From Java EE to Spring Boot 3

#### Before (Legacy)
```java
// XML Configuration (applicationContext.xml)
<beans xmlns="http://www.springframework.org/schema/beans">
    <bean id="userService" class="com.example.UserService">
        <property name="repository" ref="userRepository"/>
    </bean>
</beans>

// Java EE Servlet
@WebServlet("/users")
public class UserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        // Manual database connection
        Connection conn = DriverManager.getConnection(url, user, pass);
        // ... manual query execution
    }
}
```

#### After (Modern)
```java
// Java Configuration
@Configuration
public class AppConfig {
    @Bean
    public UserService userService(UserRepository repository) {
        return new UserService(repository);
    }
}

// Spring Boot REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }
}
```

### Key Changes

1. **JDK 8 → JDK 21**
   - Use records for DTOs
   - Pattern matching
   - Text blocks
   - Sealed classes

2. **Spring Framework 4 → Spring Boot 3**
   - Jakarta EE (instead of javax)
   - WebFlux support
   - Native compilation with GraalVM

3. **Configuration**
   - Remove XML configuration
   - Use `application.yml`
   - Leverage auto-configuration

4. **Dependencies**
   - Spring Boot Starters
   - Spring Data JPA
   - Spring Security

## C#/.NET Migration

### From .NET Framework to .NET 8

#### Before (Legacy)
```csharp
// Web API Controller (ASP.NET Web API 2)
public class TicketsController : ApiController {
    private readonly TicketsDbContext _context;
    
    public TicketsController() {
        _context = new TicketsDbContext();
    }
    
    [HttpGet]
    [Route("api/tickets")]
    public IHttpActionResult GetTickets() {
        return Ok(_context.Tickets.ToList());
    }
}

// Configuration in Web.config
<configuration>
    <connectionStrings>
        <add name="DefaultConnection" 
             connectionString="Data Source=..." />
    </connectionStrings>
</configuration>
```

#### After (Modern)
```csharp
// Minimal API (.NET 8)
var app = builder.Build();

app.MapGet("/api/tickets", async (TicketsDbContext context) => {
    return Results.Ok(await context.Tickets.ToListAsync());
});

// Configuration in appsettings.json
{
  "ConnectionStrings": several parts:
    "DefaultConnection": "Host=localhost;Database=lmra"
  }
}
```

### Key Changes

1. **.NET Framework 4.x → .NET 8**
   - Cross-platform support
   - Improved performance
   - Native AOT compilation

2. **Minimal APIs**
   - Less boilerplate
   - Better performance
   - Simpler routing

3. **Nullable Reference Types**
   - Compile-time null safety
   - Fewer runtime errors

4. **Records for DTOs**
```csharp
public record TicketDto(int Id, string Title, string Status);
```

## Frontend Migration

### From jQuery to Next.js

#### Before (Legacy)
```html
<!-- Traditional HTML page -->
<!DOCTYPE html>
<html>
<head>
    <script src="jquery.js"></script>
</head>
<body>
    <div id="tickets"></div>
    <script>
        $(document).ready(function() {
            $.ajax({
                url: '/api/tickets',
                success: function(data) {
                    $('#tickets').empty();
                    $.each(data, function(i, ticket) {
                        $('#tickets').append('<div>' + ticket.title + '</div>');
                    });
                }
            });
        });
    </script>
</body>
</html>
```

#### After (Modern)
```typescript
// Next.js Server Component
export default async function TicketsPage() {
    const tickets = await fetch('http://localhost:8081/api/tickets')
        .then(res => res.json());
    
    return (
        <div>
            {tickets.map(ticket => (
                <div key={ticket.id}>{ticket.title}</div>
            ))}
        </div>
    );
}
```

### Key Changes

1. **jQuery → React**
   - Component-based architecture
   - Virtual DOM
   - Declarative UI

2. **Server-Side Rendering**
   - Next.js SSR/SSG
   - Better SEO
   - Faster initial load

3. **TypeScript**
   - Type safety
   - Better IDE support
   - Fewer bugs

4. **Modern Tooling**
   - Vite/Next.js build system
   - Hot module replacement
   - Code splitting

## Android Migration

### From XML Layouts to Jetpack Compose

#### Before (Legacy)
```xml
<!-- activity_main.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    
    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Tickets" />
    
    <RecyclerView
        android:id="@+id/recyclerView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />
</LinearLayout>

<!-- MainActivity.java -->
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        TextView title = findViewById(R.id.title);
        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        // ... setup recycler view
    }
}
```

#### After (Modern)
```kotlin
// MainActivity.kt with Compose
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LMRAT themes {
                TicketsScreen()
            }
        }
    }
}

@Composable
fun TicketsScreen() {
    val tickets by remember { mutableStateOf(listOf<Ticket>()) }
    
    Column {
        Text("Tickets", style = MaterialTheme.typography.h4)
        LazyColumn {
            items(tickets) { ticket ->
                TicketItem(ticket = ticket)
            }
        }
    }
}
```

### Key Changes

1. **XML → Jetpack Compose**
   - Declarative UI
   - Less boilerplate
   - Type-safe
   - Preview support

2. **Java → Kotlin**
   - Null safety
   - Coroutines
   - Extension functions
   - Data classes

3. **MVVM Architecture**
   - ViewModel with State
   - One-way data flow
   - Easy testing

4. **Modern Libraries**
   - Kotlinx Serialization
   - Ktor for networking
   - Room for local storage

## Database Migration

### Migration Strategy

1. **Schema Evolution**
   - Use Flyway (Java) or EF Core Migrations (C#)
   - Version control for database changes
   - Rollback capabilities

2. **Data Migration**
   ```sql
   -- Example: Adding a new column
   ALTER TABLE tickets ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium';
   
   -- Migrating old data
   UPDATE tickets SET priority = 'High' WHERE importance = 'Critical';
   ```

3. **Performance Optimization**
   - Add indexes
   - Optimize queries
   - Use connection pooling

## Infrastructure Migration

### From Traditional Servers to Cloud-Native

#### Before (Legacy)
- Manual server provisioning
- SSH to servers for deployment
- Manual backups
- No auto-scaling
- Fixed capacity

#### After (Modern)
- Infrastructure as Code (Terraform)
- Container orchestration (ECS/Kubernetes)
- Automated backups
- Auto-scaling
- Pay-as-you-go

## Migration Checklist

- [ ] Analyze legacy code
- [ ] Identify dependencies
- [ ] Create migration plan
- [ ] Set up CI/CD pipeline
- [ ] Write tests
- [ ] Migrate incrementally
- [ ] Monitor in production
- [ ] Document changes
- [ ] Train team on new stack

## Best Practices

1. **Incremental Migration**
   - Don't rewrite everything at once
   - Use strangler pattern
   - Maintain dual systems during transition

2. **Test Coverage**
   - Maintain high test coverage
   - Integration tests
   - End-to-end tests

3. **Documentation**
   - API documentation
   - Architecture decision records (ADRs)
   - Runbooks

4. **Monitoring**
   - Application metrics
   - Error tracking
   - Performance monitoring

